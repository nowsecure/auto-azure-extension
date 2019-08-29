# Azure DevOps Extension for NowSecure Auto Security Test

## Marketplace URL for Installation and Download to TFS/Azure DevOps Server:
- [https://marketplace.visualstudio.com/items?itemName=Nowsecure-com.azure-nowsecure-auto-security-test]

## Development
- install node
- npm install -g tfx-cli
- cd Nowsecure
- npm install

Edit task.json to update version

Edit index.ts to update business logic/params

Finally, run
```
  tsc
```

Note: It uses same core Java code that is used by the CircleCI (https://github.com/nowsecure/auto-circleci-plugin)


## Deploy
```
  cd Nowsecure && npm install && tsc;cd .. && tfx extension create --rev-version --manifest-globs vss-extension.json
```

Then upload extension (vsix) to https://marketplace.visualstudio.com/manage/publishers/nowsecure-com?noPrompt=true

### Installation

See [Overview documentation](overview.md)


## References
- Create Publisher - https://marketplace.visualstudio.com/manage/createpublisher?managePageRedirect=true
- https://azure.microsoft.com/en-us/services/devops/
- https://github.com/microsoft/azure-pipelines-tasks
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops&viewFallbackFrom=vsts
- https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops
- https://github.com/microsoft/azure-devops-extension-sample
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/integrate/index?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/overview?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/samples-overview?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/service-hooks/overview?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/publish/integration?view=azure-devops
- https://marketplace.visualstudio.com/items?itemName=Veracode.veracode-vsts-build-extension
- https://marketplace.visualstudio.com/manage/publishers/nowsecure?noPrompt=true
- https://dev.azure.com/nowsecure/_git/poc_azure_ci_ext
- https://marketplace.visualstudio.com/manage/publishers/nowsecure
- https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/samples-overview?toc=%2Fazure%2Fdevops%2Fextend%2Ftoc.json&bc=%2Fazure%2Fdevops%2Fextend%2Fbreadcrumb%2Ftoc.json&view=azure-devops
