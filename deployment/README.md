# How to deploy the app

## Build the app

Replace the **username/organization name** and **version number** (Using semantic versioning: major.minor.patch)

```bash
# e.g., docker build -t cerit.io/xmudry/mdrepo-frontend:v0.4.1 .
# Note: '.' at the end specifies the path to the Dockerfile
docker build -t cerit.io/<username|org-name>/mdrepo-frontend:vX.Y.Z .
```

## Push the app to the Harbor

- Login to the [Harbor image registry](https://docs.cerit.io/en/docs/docker/harbor)

- Get your credentials and [log in through the CLI](https://docs.cerit.io/en/docs/docker/harbor#logging-in-through-command-line)

```bash
docker login cerit.io
# use credentials from the Harbor web interface
````

- Push the image to the registry
```bash
docker push cerit.io/<username|org-name>/mdrepo-frontend:vX.Y.Z
```

## Apply deployment to the cluster

- First you need to have access to the [Rancher](https://docs.cerit.io/en/docs/platform/access)

    - For this README, we use **kube-cluster** and **private namespace** (`<surname>-ns`), but it can be used for deployment to your organization as well

- In `deployment.yaml` switch to the current version (that you pushed to the Harbor)
```yaml
containers:
- name: mdrepo-frontend
image: cerit.io/xmudry/mdrepo-frontend:v0.4.1  # same version as in the Harbor
```

- Apply the files
```bash
cd deployment
kubectl apply -f deployment.yaml -n <namespace>

# if you are deploying for the first time to the namespace, use:
kubectl apply -f deployment.yaml ingress.yaml service.yaml -n <namespace>
```

## Access the deployment

Visit the website: https://mdrepo-frontend.dyn.cloud.e-infra.cz/ (based on the ingress configuration)
