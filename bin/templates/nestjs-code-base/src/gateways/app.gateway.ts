import { Logger, UseGuards } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { GatewayGuard } from '@/guards'

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server
  private readonly logger = new Logger(AppGateway.name)

  afterInit() {
    this.logger.log('Gateway init')
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @UseGuards(GatewayGuard)
  @SubscribeMessage('client-send')
  socketTest(client: Socket, payload?: string) {
    client.broadcast.emit('server-send', payload)
  }
}
