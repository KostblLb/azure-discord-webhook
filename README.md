# azure-discord-webhook
Proxy app to translate Azure DevOps messages to Discord webhooks format

# How to use
1. Create a Discord webhook, and copy its URL
2. In your Azure DevOps, create a new Web Hook by following these steps:
    - Select a project and open Project **Settings->General->Service Hooks**, and hit **'Create Subscription'** button. Select **'Web Hooks'** option and hit **'Next'**
    - Chose a desired trigger and filters, hit **'Next'**
3. In the Azure Webhook settings' Action page, enter URL for posting as `https://azure-discord-webhook.domain.com/?q=<discord webhook url>`. You may leave other fields untouched
4. Hit **'Test'** button. The result should be a success, and a message should come to the Discord channel with your webhook.

# Try it
On https://azure-discord-webhook.herokuapp.com/
