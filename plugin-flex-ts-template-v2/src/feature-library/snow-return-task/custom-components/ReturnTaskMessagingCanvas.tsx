import * as Flex from '@twilio/flex-ui';
import { Badge, Box, Card, Heading, Paragraph } from "@twilio-paste/core";
import { WarningIcon } from '@twilio-paste/icons/esm/WarningIcon';

export const ReturnTaskMessagingCanvas = (props: any) => { 
    const task = Flex.TaskHelper.getTaskFromConversationSid(props.sid);
    const requestItem = task?.attributes?.requestItem;
    const incident = task?.attributes?.incident;
    
    //register channel
    if (!Flex.TaskChannels.getRegistered().find(tc => tc.name === 'return')) {
        const returnChatChannel = Flex.DefaultTaskChannels.createChatTaskChannel("return", (task) => true);
        if (returnChatChannel.templates && returnChatChannel.templates.TaskCanvasTabs) {
            returnChatChannel.templates.TaskCanvasTabs.contentTabHeader = 'Retorno';
        }
        returnChatChannel.name = "return";
        Flex.TaskChannels.register(returnChatChannel);
    } 

    return (
        <Box padding="space50">
            <Card>
                <Box paddingBottom="space40">
                    <Badge as="span" variant="warning">
                        <WarningIcon decorative />Atenção
                    </Badge>
                </Box>
                <Heading as="h2" variant="heading20">
                    Tarefa de Retorno do ServiceNow
                </Heading>
                <Paragraph>
                    Esta tarefa é um retorno de um{ incident ? " incidente" : "a requisição"} do ServiceNow e não tem um canal de comunicação
                    aberto com o cliente. Por favor, verifique o que está pendente no painel a direita e faça as alterações necessárias.
                </Paragraph>
                <Paragraph marginBottom="space0">
                    - {incident ?? requestItem}
                </Paragraph>
            </Card>
        </Box>
    );
}