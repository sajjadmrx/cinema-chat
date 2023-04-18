FROM mongo:5

# we take over the default & start mongo in replica set mode in a background task
ENTRYPOINT mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip_all & MONGOD_PID=$!; \
# we prepare the replica set with a single node and prepare the root user config
INIT_REPL_CMD="rs.initiate()"; \
# we wait for the replica set to be ready and then submit the commands just above
until (mongo admin --port $MONGO_REPLICA_PORT --eval "$INIT_REPL_CMD"); do sleep 1; done; \
# we are done but we keep the container by waiting on signals from the mongo task
echo "REPLICA SET ONLINE"; wait $MONGOD_PID;
