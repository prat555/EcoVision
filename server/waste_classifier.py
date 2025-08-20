from transformers import pipeline
import sys

# Load the waste classification pipeline
pipe = pipeline("image-classification", model="watersplash/waste-classification")

def classify_image(image_path):
    results = pipe(image_path)
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python waste_classifier.py <image_path>")
    else:
        image_path = sys.argv[1]
        output = classify_image(image_path)
        print(output)