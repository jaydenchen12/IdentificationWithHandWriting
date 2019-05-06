import pika

def produce_msg(image_id):
    
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='172.18.0.2'))
    channel = connection.channel()
    exchange_name = ''
    routing_key = 'task_queue'
    channel.queue_declare(queue=routing_key, durable=True)
    msg = str(image_id)
#
    channel.basic_publish(
        exchange=exchange_name,
        routing_key=routing_key,
        body=image_id,
        properties=pika.BasicProperties(
                delivery_mode=2
        ))

    print(" [OK] Sent %r" % msg)
    connection.close()
    
    

