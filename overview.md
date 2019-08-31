## Azure Extension for NowSecure Auto API
This extension/plugin adds the ability to perform automatic mobile app security testing for Android and iOS mobile apps through the NowSecure AUTO test engine.

### Summary:
Purpose-built for mobile app teams, NowSecure AUTO provides fully automated, mobile appsec testing coverage (static+dynamic+behavioral tests) optimized for the dev pipeline. Because NowSecure tests the mobile app binary post-build from Azure Devops, it can test software developed in any language and provides complete results including newly developed code, 3rd party code, and compiler/operating system dependencies. With near zero false positives, NowSecure pinpoints real issues in minutes, with developer fix details, and routes tickets automatically into ticketing systems, such as Jira. NowSecure is frequently used to perform security testing in parallel with functional testing in the dev cycle. Requires a license for and connection to the NowSecure AUTO software. https://www.nowsecure.com

## Job Parameters
Following are parameters needed for the job:
- token: mandatory parameter for API token. visit https://docs.nowsecure.com/auto/integration-services/jenkins-integration to generate token. Also, we recommend using job variable and using that in your build instead of hard coding token in your build script.
- filepath: mandatory parameter to specify mobile binary.
- group: mandatory parameter for group-id.
- artifactsDir: mandatory parameter for directory where API results are stored.
- url: optional parameter for nowsecure auto API URL with default value of https://lab-api.nowsecure.com
- waitMinutes: optional parameter to specify maximum wait in minutes until security test is completed. The default value is 0 minutes that won't wait for completion of the job on NowSecure server.
- showStatusMessages: Optional flag to show status messages from automation testing.
- score: Optional numeric value to break the build if security score from analysis is lower than the score value.

### Access token
Generate token as described on https://docs.nowsecure.com/auto/integration-services/jenkins-integration.

### Installation

Find it in [Azure Devops Marketplace](https://marketplace.visualstudio.com/azuredevops) using "NowSecure Security Test Extension"
![](images/marketplace.png)

Then install it as follows:
![](images/install.png)

#### Add to your Build

#### Basic Config
![](images/basic-config.png)

#### Advanced Config
![](images/advanced-config.png)

#### Sample Build Pipeline for Android
```
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
```
Note: "task: azure-nowsecure-auto-security-test@1" is the main task for security analysis and other tasks above are used to generate Android apk file.

#### Publish/View Artifacts
You can add task to publish artifacts (API results) from Nowsecure security task as follows
```
- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: '$(build.artifactStagingDirectory)'
    artifactName: 'NowSecureArtifacts'
    artifactType: 'container'
```

You can view artifacts from the build output such as:
![](images/artifacts.png)


#### View Output logs
![](images/log.png)


#### Debugging
- Add variable for system.debug=true in your build to see more detailed logs, e.g.,
![](images/debug.png)
