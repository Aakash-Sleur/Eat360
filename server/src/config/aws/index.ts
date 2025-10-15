import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";

const client = new SchedulerClient({
  region: process.env.AWS_REGION,
});

export async function scheduleOneTimeRecipePublish(recipeId: string, scheduledAt: string) {
  const scheduleName = `schedule-${recipeId}-${Date.now()}`; // unique name

  // Choose a time in the future (UTC) and format it without milliseconds or trailing Z
  // EventBridge Scheduler expects: YYYY-MM-DDTHH:MM:SS (no fractional seconds, no 'Z')
  const runAt = scheduledAt.split('.')[0]; // e.g. 2025-10-13T15:08:31

  // Payload that will be passed to your Lambda
  const payload = JSON.stringify({
    recipeId,
    scheduleName,
  });

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    GroupName: "default", // default group
  ScheduleExpression: `at(${runAt})`, // one-time trigger (formatted YYYY-MM-DDTHH:MM:SS)
    FlexibleTimeWindow: { Mode: "OFF" },
    Target: {
      Arn: process.env.TARGET_ARN,
      RoleArn: process.env.EXECUTION_ROLE_ARN,
      Input: payload,
    },
  });

  try {
    await client.send(command);
    console.log(`✅ One-time schedule created!`);
    console.log(`Name: ${scheduleName}`);
    console.log(`Runs at: ${runAt}`);
  } catch (err) {
    console.error("❌ Failed to create schedule:", err);
  }
}


