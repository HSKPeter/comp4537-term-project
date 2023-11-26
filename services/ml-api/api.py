import json
from sagemaker.predictor import Predictor
from sagemaker.serializers import JSONSerializer
from sagemaker.deserializers import JSONDeserializer

ERROR_MESSAGES = {
    "summarize": "An error occurred while summarizing text",
    "invalid_method": "Method not allowed",
    "invalid_path": "Path not found"
}

HTTP_STATUS_CODES = {
    "success": 200,
    "not_found": 404,
    "method_not_allowed": 405,
    "internal_server_error": 500
}


def summarize(text):
    endpoint_name = "huggingface-pytorch-inference-2023-11-26-02-33-51-305"
    predictor = Predictor(endpoint_name=endpoint_name,
                        serializer=JSONSerializer(),
                        deserializer=JSONDeserializer())

    predictions = predictor.predict({"inputs": text})
    print(predictions)

    prediction, = predictions
    summary = prediction["summary_text"]

    return summary

def lambda_handler(event, context):
    try:
        # Get the request body from the event stream
        request_body = json.loads(event["body"])

        # Get the input from the request body
        text = request_body["text"]
        summary = summarize(text)

        # Return the response
        return {
            "statusCode": HTTP_STATUS_CODES["success"],
            "body": {
                "summary": summary
            }
        }
    except Exception as e:
        print(e)
        return {
            "statusCode": HTTP_STATUS_CODES["internal_server_error"],
            "body": {
                "error": ERROR_MESSAGES["summarize"]
            }
        }
