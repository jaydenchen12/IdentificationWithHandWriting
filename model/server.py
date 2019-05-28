#!/usr/bin/env python
import pika
import time
import test_signature

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host="rabbit"))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)
print(' [*] Waiting for messages. To exit press CTRL+C')


def callback(ch, method, properties, body):
    print(" [OK] Received %r" % body)
#    print("type of %r" % type(body), flush=True)
    test_signature.test(body.decode())
    print(" [OK] Done")
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue='task_queue', on_message_callback=callback)

channel.start_consuming()
