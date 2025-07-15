import tl = require("azure-pipelines-task-lib/task");
import tr = require("azure-pipelines-task-lib/toolrunner");
import fs = require("fs");
import path = require("path");

const enum Arch {
  X86 = "x86",
  X64 = "amd64",
  ARM = "arm"
}

function platformToString(platform: tl.Platform) {
  switch (platform) {
    case tl.Platform.Windows:
      return "windows";
    case tl.Platform.Linux:
      return "linux";
    case tl.Platform.MacOS:
      return "darwin";
  }
}

function chmodx(toolPath: string, platform: tl.Platform) {
  if (platform !== tl.Platform.Windows) {
    tl.execSync("chmod", ["u+x", toolPath])
  } else {
    tl.execSync("attrib", ["+x", toolPath])
  }
}

function archFrom(envvar: string): Arch {
  switch (envvar) {
    case "X86":
      return Arch.X86
    case "X64":
      return Arch.X64
    case "ARM":
      return Arch.ARM
    default:
      const emsg = "Unknown system architecture"
      tl.setResult(tl.TaskResult.Failed, emsg)
      throw new Error(emsg)
  }
}

function toolName(arch: Arch, platform: tl.Platform): string {
  // Ex: ns_linux-amd64
  return `ns_${platformToString(platform)}-${arch}${platform === tl.Platform.Windows ? '.exe' : ''}`
}

function getTool(): tr.ToolRunner {
  const platform = tl.getPlatform()
  const arch = archFrom(tl.getVariable("Agent.OSArchitecture"))
  const toolPath = path.join(__dirname, toolName(arch, platform));

  if (!fs.existsSync(toolPath)) {
    const err =
      "Unsupported runner type. Integration currently supports darwin/arm64, windows/amd64, and linux/amd64"
    tl.error(err)
    tl.setResult(tl.TaskResult.Failed, err)
    throw new Error(err)
  }

  chmodx(toolPath, platform)

  return tl.tool(toolPath)
}

type Inputs = {
  // required params
  filepath: string;
  group: string;
  token: string;
  // optional params
  artifact_dir?: string;
  api_host?: string;
  ui_host?: string;
  log_level?: string;
  analysisType?: string;
  minimum_score?: string;
  polling_duration_minutes?: string;
}

function getInputs(): Inputs {
  const inputs = {
    filepath: tl.getPathInputRequired("binary_file", true),
    group: tl.getInput("group", true),
    token: tl.getInput("token", true),
    // optional params
    artifact_dir: tl.getInput("artifact_dir", false),
    api_host: tl.getInput("api_host", false),
    ui_host: tl.getInput("ui_host", false),
    log_level: tl.getInput("log_level", false),
    analysisType: tl.getInput("analysis_type", false),
    minimum_score: tl.getInput("minimum_score", false),
    polling_duration_minutes: tl.getInput("polling_duration_minutes", false)
  }

  if (inputs.analysisType === 'static') {
    inputs.polling_duration_minutes = inputs.polling_duration_minutes || '30'
  } else {
    inputs.polling_duration_minutes = inputs.polling_duration_minutes || '60'
  }

  return inputs
}

async function run() {
  const task = JSON.parse(fs.readFileSync(path.join(__dirname, "task.json")).toString());
  const version = `${task.version.Major}.${task.version.Minor}.${task.version.Patch}`

  const inputs = getInputs()

  tl.mkdirP(inputs.artifact_dir)

  const ns = getTool()
    .arg("run")
    .arg("file")
    .arg(inputs.filepath)
    .line(`--group-ref ${inputs.group}`)
    .line(`--token ${inputs.token}`)
    .line(`--output ${path.join(inputs.artifact_dir, "assessment.json")}`)
    .line(`--api-host ${inputs.api_host}`)
    .line(`--ui-host ${inputs.ui_host}`)
    .line(`--log-level ${inputs.log_level}`)
    .line(`--analysis-type ${inputs.analysisType}`)
    .line(`--minimum-score ${inputs.minimum_score}`)
    .line(`--poll-for-minutes ${inputs.polling_duration_minutes}`)
    .line(`--ci-environment azure-${version}`)

  ns.on("stdout", function(data: Buffer) {
    console.log(data.toString());
  });

  let exitCode: number
  exitCode = await ns.execAsync()

  if (exitCode != 0) {
    const errmsg = "NowSecure extension failed with nonzero exitcode"
    tl.setResult(tl.TaskResult.Failed, errmsg)
  }
}

try {
  run()
} catch (err) {
  const errmsg = `NowSecure extension failed with error: [ ${err} ]`
  tl.setResult(tl.TaskResult.Failed, errmsg)
}
