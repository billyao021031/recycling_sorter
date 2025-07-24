import torch
import torch.nn as nn
from torchvision.models import mobilenet_v2

class MobileNetWithMass(nn.Module):
    def __init__(self, num_classes=5, pretrained=True):
        super().__init__()
        self.backbone = mobilenet_v2(weights="IMAGENET1K_V1" if pretrained else None)

        self.backbone.classifier = nn.Identity()
        
        self.classifier = nn.Sequential(
            nn.Linear(1280 + 1, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes),
        )

    def forward(self, x, mass):
        x = self.backbone(x)
        x = torch.cat((x, mass), dim=1)
        return self.classifier(x)