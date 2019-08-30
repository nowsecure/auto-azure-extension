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

