import tl = require("azure-pipelines-task-lib/task");
import tr = require("azure-pipelines-task-lib/toolrunner");
import fs = require("fs");
import path = require("path");


function getTool() : tr.ToolRunner  {
  const platform = tl.getPlatform()
  const arch = tl.getVariable("Agent.OSArchitecture")

  if (arch != 'X64') {
    const err = "Unsupported runner architecture"
    tl.error(err)
    tl.setResult(tl.TaskResult.Failed, err)
    throw new Error(err)
  }

  if (platform === tl.Platform.Windows) {
    return tl.tool("./ns.exe")
  }
  return tl.tool("./ns")
}

// required params
const filepath = tl.getPathInput("binary_file", true, true);
const group = tl.getInput("group", true);
const token = tl.getInput("token", true);

// Optional parameters
const artifact_dir = tl.getInput("artifact_dir", false);
const api_host = tl.getInput("api_host", false);
const ui_host = tl.getInput("ui_host", false);
const log_level = tl.getInput("log_level", false);
const analysisType = tl.getInput("analysis_type", false);
const minimum_score = tl.getInput("minimum_score", false);

let polling_duration_minutes = tl.getInput("polling_duration_minutes", false);

if (analysisType === 'static') {
  polling_duration_minutes = polling_duration_minutes || '30'
} else {
  polling_duration_minutes = polling_duration_minutes || '60'
}

const task = JSON.parse(fs.readFileSync(path.join(__dirname, "task.json")).toString());
const version = `${task.version.Major}.${task.version.Minor}.${task.version.Patch}`

const ns = getTool()
            .arg("run file")
            .arg(filepath)
            .arg(`--group-ref ${group}`)
            .arg(`--token ${token}`)
            .arg(`--output ${artifact_dir}`)
            .arg(`--api-host ${api_host}`)
            .arg(`--ui-host ${ui_host}`)
            .arg(`--log-level ${log_level}`)
            .arg(`--minimum-score ${minimum_score}`)
            .arg(`--ci-environment azure-${version}`)

ns.on("stdout", function (data: Buffer) {
  console.log(data.toString());
});

//////////////////////////////////////////////////////////////////////////
// Starting Ns app to process the app for preflight and assessment
// based on above config.
//////////////////////////////////////////////////////////////////////////
ns.exec()
  .then(function (code: number) {
    tl.debug("code: " + code);
    if (code != 0) {
      const errmsg = "azure-nowsecure-auto-security-test upload and security test failed."
      tl.error(errmsg)
      tl.setResult(tl.TaskResult.Failed, errmsg)
    }
  })
  .fail(function (err: Error) {
    const errmsg = `azure-nowsecure-auto-security-test upload and security test failed [ ${err} ]`
      tl.error(errmsg)
      tl.setResult(tl.TaskResult.Failed, errmsg)
  });
