"use strict";

import tl = require('vsts-task-lib/task');
import utils = require('../utils/utilities');

export class KubernetesWorkload {
    static Pod: string = "Pod";
    static Replicaset: string = "Replicaset";
    static Deployment: string = "Deployment";
    static StatefulSet: string = "StatefulSet";
    static DaemonSet: string = "DaemonSet";
}

export const recognizedWorkloadTypes: string[] = ["deployment", "replicaset", "daemonset", "pod", "statefulset"];
export const recognizedWorkloadTypesWithRolloutStatus: string[] = ["deployment", "daemonset", "statefulset"];

let isRelease = utils.isEqual(tl.getVariable("SYSTEM_HOSTTYPE"), "release", utils.StringComparer.OrdinalIgnoreCase);

export let pipelineAnnotations: string[] = [];
const devAzurePrefix = "dev.azure.com";
const vstsPrefix = "visualstudio.com";

let orgName = "";
let orgUrl = tl.getVariable("System.TeamFoundationCollectionUri");
if (orgUrl.indexOf(devAzurePrefix) > -1) {
    orgName = orgName.substring(orgName.indexOf(devAzurePrefix) + devAzurePrefix.length).trim().replace("/", "");
}

if (orgUrl.indexOf(vstsPrefix) > -1) {
    orgName = orgName.split(".")[0].replace("https://", "");
}

if (isRelease) {
    pipelineAnnotations = [
        `azure-pipelines/run=${tl.getVariable("Release.ReleaseId")}`,
        `azure-pipelines/pipeline="${tl.getVariable("Release.DefinitionName")}"`,
        `azure-pipelines/pipelineId="${tl.getVariable("Release.DefinitionId")}"`,
        `azure-pipelines/jobName="${tl.getVariable("Agent.JobName")}"`,
        `azure-pipelines/runuri=${orgUrl}${tl.getVariable("System.TeamProject")}/_releaseProgress?releaseId=${tl.getVariable("Release.ReleaseId")}`,
        `azure-pipelines/project=${tl.getVariable("System.TeamProject")}`,
        `azure-pipelines/org=${orgName}`
    ];
}
else {
    pipelineAnnotations = [
        `azure-pipelines/run=${tl.getVariable("Build.BuildNumber")}`,
        `azure-pipelines/pipeline="${tl.getVariable("Build.DefinitionName")}"`,
        `azure-pipelines/pipelineId="${tl.getVariable("System.DefinitionId")}"`,
        `azure-pipelines/jobName="${tl.getVariable("Agent.JobName")}"`,
        `azure-pipelines/runuri=${orgUrl}${tl.getVariable("System.TeamProject")}/_build/results?buildId=${tl.getVariable("Build.BuildId")}`,
        `azure-pipelines/project=${tl.getVariable("System.TeamProject")}`,
        `azure-pipelines/org=${orgName}`
    ];
}
