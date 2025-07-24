import torch, os, io
from PIL import Image
import torchvision.transforms as transforms
from .mobilenet_with_mass import MobileNetWithMass
from .residual_material_classifier import ResidualMaterialClassifier

CATEGORIES = ["Glass", "Metal", "Paper", "Plastic", "Trash"]
ROOT = os.path.dirname(__file__)
MODEL1_PATH = os.path.join(ROOT, "model1.pth")
MODEL2_PATH = os.path.join(ROOT, "model2.pth")

def preprocess_image(image_bytes):
    t = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225]),
    ])
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return t(img).unsqueeze(0)

def _predict(model, device, tensor, grams):
    tensor = tensor.to(device)
    mass = torch.tensor([[grams]], dtype=torch.float32).to(device)
    with torch.no_grad():
        out = model(tensor, mass)

        print("RAW logits:", out.squeeze().tolist())          ###
        print("SOFTMAX:", torch.softmax(out, 1).squeeze().tolist())  ###
        probs = torch.softmax(out, 1)
        conf, idx = torch.max(probs, 1)
        return {
            "predicted_class": CATEGORIES[idx.item()],
            "confidence": float(conf.item()),
            "raw_output": out.cpu().numpy().tolist(),
        }

def run_inference_model1(tensor, weight_grams):
    device = torch.device("mps")
    m = MobileNetWithMass(len(CATEGORIES), pretrained=False)
    m.load_state_dict(torch.load(MODEL1_PATH, map_location=device))
    m.eval().to(device)
    return _predict(m, device, tensor, weight_grams)

def run_inference_model2(tensor, weight_grams):
    device = torch.device("mps")
    m = ResidualMaterialClassifier(len(CATEGORIES))
    m.load_state_dict(torch.load(MODEL2_PATH, map_location=device))
    m.eval().to(device)
    return _predict(m, device, tensor, weight_grams)
