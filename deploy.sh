docker build -t robertdominato/multi-client:latest -t robertdominato/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t robertdominato/multi-server:latest -t robertdominato/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t robertdominato/multi-worker:latest -t robertdominato/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push robertdominato/multi-client:latest
docker push robertdominato/multi-server:latest
docker push robertdominato/multi-worker:latest
docker push robertdominato/multi-client:$SHA
docker push robertdominato/multi-server:$SHA
docker push robertdominato/multi-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=robertdominato/multi-server:$SHA
kubectl set image deployments/client-deployment client=robertdominato/multi-client:$SHA
kubectl set image deployments/worker-deployment server=robertdominato/multi-worker:$SHA