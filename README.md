# node-consul-registrator
Node.js based service that registers Docker containers with Consul. 

# Usage 
Start the service by running this command:

```
npm start
```

# Description 
It will poll docker every 3 seconds to retrieve the running containers from the specified docker socket. 

A local cache is kept with the running containers. When new containers are found (not in the cache), these are registered with Consul. 

Every exposed public port of the container will be registered as a separate service in Consul.

Once a container is no longer reported in docker, it will be removed from the cache and deregistered with Consul. 

The node process will be running indefinitely until killed. 
Any errors are logged to the console.
