import Docker from 'dockerode';
import Consul from "consul";
const docker = new Docker({socketPath: '/var/run/docker.sock'});
const consul = new Consul({host: '172.20.2.12'});
const containerCache = new Map();

async function main() {
    setInterval(async () => {
        try {
            // only list running
            const containers = await docker.listContainers({all: false});
            const found = [];
            containers.forEach(async (containerInfo) => {
                if (containerInfo.Ports.length === 0) {
                    return;
                }
                
                for (let i = 0; i < containerInfo.Ports.length; i++) {
                    let port = containerInfo.Ports[i];
                    if (port.PublicPort) {
                        let cacheId = `${containerInfo.NetworkSettings.Networks.bridge.Gateway}_${port.PublicPort}`;
                        if (!containerCache.has(cacheId)) {
                            consul.agent.service.register({
                                name: containerInfo.Names[0],
                                id: cacheId,
                                address: containerInfo.NetworkSettings.Networks.bridge.Gateway,
                                port: port.PublicPort,
                                tags: [] // TODO from inspect
                            });
                
                            console.info(`Registered ${cacheId} ${containerInfo.Names[0]} with Consul`);

                            // Add to local cache and Consul
                            containerCache.set(cacheId, containerInfo);
                        } 
                        found.push(cacheId);
                    }
                }
            });
            containerCache.forEach(async (containerInfo, id) => {
                if (!found.includes(id)) { 
                    for (let i = 0; i < containerInfo.Ports.length; i++) {
                        let port = containerInfo.Ports[i];
                        if (port.PublicPort) {
                            let cacheId = `${containerInfo.NetworkSettings.Networks.bridge.Gateway}_${port.PublicPort}`;
                            containerCache.delete(cacheId);

                            console.info(`Removed ${cacheId} ${containerInfo.Names[0]} from local cache`);

                            // Remove from Consul
                            consul.agent.service.deregister(cacheId);

                            console.info(`Deregistered ${cacheId} from Consul`);
                        }
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    }, 3000);
}

main();