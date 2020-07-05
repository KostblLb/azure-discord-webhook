# azure-discord-webhook
Proxy app to translate Azure DevOps messages to Discord webhooks format

# How to use
1. Create a Discord webhook, and copy its URL
2. Send a GET request to the app URL with the webhook's URL as query parameter 'q', like this:
`GET https://azure-discord-webhook.domain.com/?q=https://discordapp.com/api/webhooks/728789913434980374/DIUrFtsKzpHePKP895wnIK6lSbTaBIhn6xQaaL48e9E8gP5ZEpNesTQGeLRuXvrMNRUd`
3. The response should contain an ID matching the webhook's URL. Save it for now.
4. In your Azure DevOps, create a new Web Hook by following these steps:
    - Select a project and open Project **Settings->General->Service Hooks**, and hit **'Create Subscription'** button. Select **'Web Hooks'** option and hit **'Next'**
    - Chose a desired trigger and filters, hit **'Next'**
5. In the Azure Webhook settings' Action page, enter URL for posting as `https://azure-discord-webhook.domain.com/<endpoint id from step 3>`. You may leave other fields untouched
6. Hit **'Test'** button. The result should be a success, and a message should come to the Discord channel with your webhook.

[![a](https://prnt.sc/tc2fsj)](https://prnt.sc/tc2fsj)
