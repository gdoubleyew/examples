import tornado.ioloop
import tornado.web
import tornado.websocket
import threading
import asyncio
from queue import Queue

wsChatClients = []
wsLogClients = []
chatMsgQ = Queue()

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index-tornado.html')


class ChatWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
      print("Chat WebSocket opened")
      wsChatClients.append(self)

    def on_close(self):
      print("Log WebSocket closed")
      wsChatClients.remove(self)

    def on_message(self, message):
      chatMsgQ.put(message)
      self.write_message(message)


class LogWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
      print("Log WebSocket opened")
      wsLogClients.append(self)

    def on_close(self):
      print("Log WebSocket closed")
      wsLogClients.remove(self)

    def on_message(self, message):
      print("Log message: ", message)


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r'/wsChat', ChatWebSocket),
        (r'/wsLog', LogWebSocket),
    ])


# def function to print out queued messages 
def getMessages():
    print("begin thread")
    asyncio.set_event_loop(asyncio.new_event_loop())
    while True:
        msg = chatMsgQ.get(block=True)
        print("Dequeued ", msg)
        for client in wsChatClients:
          client.write_message("Great Job!")
        for client in wsLogClients:
          client.write_message("Log message")


if __name__ == "__main__":
    chatMsgThread = threading.Thread(target=getMessages)
    chatMsgThread.setDaemon(True)
    chatMsgThread.start()

    app = make_app()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8888)
    # app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
    # ioloop.IOLoop.instance().start()

