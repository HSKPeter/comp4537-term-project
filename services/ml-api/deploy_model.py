import boto3
from sagemaker.huggingface import HuggingFaceModel
import os

role_name = os.getenv('ROLE_NAME')
iam = boto3.client('iam')

role = iam.get_role(RoleName=role_name)['Role']['Arn']

# Hub Model configuration. https://huggingface.co/models
hub = {
	'HF_MODEL_ID':'google/pegasus-large',
	'HF_TASK':'summarization'
}

# create Hugging Face Model Class
print("Creating Hugging Face Model...")
huggingface_model = HuggingFaceModel(
	transformers_version='4.26.0',
	pytorch_version='1.13.1',
	py_version='py39',
	env=hub,
	role=role, 
)
print("Created Hugging Face Model!")

print("Deploying model...")
predictor = huggingface_model.deploy(
	initial_instance_count=1, # number of instances
	instance_type='ml.m5.xlarge' # ec2 instance type
)
print("Deployed model!")

print("Predicting...")
prediction = predictor.predict({
	"inputs": "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.",
})

print(prediction)