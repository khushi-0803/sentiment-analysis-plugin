# import pandas as pd
# from sklearn.model_selection import train_test_split

# data = pd.read_csv("classified_headlines.csv")

# # Remove all punctuations and special characters
# data['clean_text'] = data['headlines'].str.replace(r'[^\w\s]', '', regex=True).str.lower()

# # Splits the data into training and testing data sets
# train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)

# # AutoModelForSequenceClassification used for sorting text into positive or negative based on what it has learned
# # TrainingArguments defines how the training should be carried out such as learning rate and batch size
# # torch is used for building and training models
# # LabelEncoder converts sentiments into numbers
# from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
# import torch
# from sklearn.preprocessing import LabelEncoder
# import pandas as pd

# # Object created for LabelEncoder
# label_encoder = LabelEncoder()

# # Give numeric form to sentiments and stores in a column called 'label'
# data['label'] = label_encoder.fit_transform(data['sentiment'])

# # Load tokenizer and model
# model_name = 'bert-base-uncased'
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSequenceClassification.from_pretrained(model_name)

# # Tokenize the data and make it understandable for BERT model
# encodings = tokenizer(list(data['clean_text']), truncation=True, padding=True, return_tensors='pt')

# # Convert to PyTorch tensors
# inputs = encodings['input_ids']
# attention_masks = encodings['attention_mask']
# labels = torch.tensor(data['label'].values).long() # Numerical labels for text, converted into PyTorch tensors

# # Create a PyTorch dataset (Creating a custom dataset class allows us to define how the data is accessed and ensures that each sample includes the input IDs, attention masks, and labels.)
# class SentimentDataset(torch.utils.data.Dataset):
#     def __init__(self, input_ids, attention_masks, labels): # Initializes the dataset
#         self.input_ids = input_ids
#         self.attention_masks = attention_masks
#         self.labels = labels

#     def __len__(self): # Returns the number of samples in the dataset
#         return len(self.labels)

#     def __getitem__(self, idx): # Returns a specific sample when given an index
#         return {
#             'input_ids': self.input_ids[idx],
#             'attention_mask': self.attention_masks[idx],
#             'labels': self.labels[idx]
#         }

# #Instatiate the dataset to be used in the training process
# train_dataset = SentimentDataset(inputs, attention_masks, labels)

# # Training arguments
# training_args = TrainingArguments(
#     output_dir='./results',
#     num_train_epochs=3,
#     per_device_train_batch_size=16,
#     per_device_eval_batch_size=16,
#     warmup_steps=500,
#     weight_decay=0.01,
#     logging_dir='./logs',
# )

# # Trainer
# trainer = Trainer(
#     model=model,
#     args=training_args,
#     train_dataset=train_dataset
# )

# # Train the model
# trainer.train()

# # Save the model
# model.save_pretrained('./sentiment_model')
# tokenizer.save_pretrained('./sentiment_model')

from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load the previously saved tokenizer and model
model_name = './sentiment_model'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from flask_cors import CORS

model_name = './sentiment_model'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data['headlines']
    
    if not isinstance(text, list) or not text:
        return jsonify({'error': 'Invalid input, expected a non-empty list of headlines'}), 400
    
    try:
        inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
        outputs = model(**inputs)
        
        predictions = torch.argmax(outputs.logits, dim=1).tolist()
        sentiments = ['negative', 'positive']
        results = [{'headline': text[i], 'sentiment': sentiments[predictions[i]]} for i in range(len(text))]
        
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': 'An error occurred during sentiment analysis'}), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)