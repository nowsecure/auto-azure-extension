# Azure DevOps Extension for NowSecure Auto Security Test

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
## Deploy
```
  cd base-directory for this project
  tfx extension create --manifest-globs vss-extension.json
```
Then upload extension (vsix) to https://marketplace.visualstudio.com/manage/publishers/nowsecure-com?noPrompt=true

## Install
- Go to your profile page https://dev.azure.com/{userid}/
- Select extensions https://dev.azure.com/{userid}/_settings/extensions?tab=installed
- If extension was shared then Install it from Shared tab otherwise Browse market place for "Azure Extension for NowSecure Auto Security Test"


## Sample Build Pipeline for Android
```
# Android
# Build your Android project with Gradle.
# Add steps that test, sign, and distribute the APK, save build artifacts, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/android

pool:
  vmImage: 'macOS 10.13'

steps:
- task: Gradle@2
  inputs:
    workingDirectory: ''
    gradleWrapperFile: 'gradlew'
    gradleOptions: '-Xmx3072m'
    publishJUnitResults: false
    testResultsFiles: '**/TEST-*.xml'
    tasks: 'assembleDebug'
- task: CopyFiles@2
  inputs:
    contents: '**/*.apk'
    targetFolder: '$(build.artifactStagingDirectory)'
- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: '$(build.artifactStagingDirectory)'
    artifactName: 'drop'
    artifactType: 'container'
- task: azure-nowsecure-auto-security-test@1
  inputs:
    artifactsDir: '$(build.artifactStagingDirectory)/NowSecureArtifacts'
    filepath: '/Users/vsts/agent/2.155.1/work/1/a/app/build/outputs/apk/app-prod-debug.apk'
    group: 'xxxxx'
    waitMinutes: 60
    showStatusMessages: true
    score: 75
    token: 'xxxxx'
- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: '$(build.artifactStagingDirectory)'
    artifactName: 'NowSecureArtifacts'
    artifactType: 'container'
```

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
