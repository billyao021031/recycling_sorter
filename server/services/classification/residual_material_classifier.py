import torch
import torch.nn as nn

class ImprovedResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, downsample=False, dropout=0.1):
        super().__init__()
        stride = 2 if downsample else 1
        mid = out_channels // 2

        self.conv1 = nn.Conv2d(in_channels, mid, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(mid)

        self.conv2 = nn.Conv2d(mid, mid, 3, stride, 1, bias=False)
        self.bn2 = nn.BatchNorm2d(mid)

        self.conv3 = nn.Conv2d(mid, out_channels, 1, bias=False)
        self.bn3 = nn.BatchNorm2d(out_channels)

        self.relu = nn.ReLU(inplace=True)
        self.dropout = nn.Dropout2d(dropout)

        self.downsample = nn.Sequential()
        if downsample or in_channels != out_channels:
            self.downsample = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, 1, stride, bias=False),
                nn.BatchNorm2d(out_channels),
            )

    def forward(self, x):
        identity = self.downsample(x)

        out = self.relu(self.bn1(self.conv1(x)))
        out = self.relu(self.bn2(self.conv2(out)))
        out = self.dropout(out)
        out = self.bn3(self.conv3(out))

        out += identity
        return self.relu(out)

class ResidualMaterialClassifier(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()

        self.features = nn.Sequential(
            ImprovedResidualBlock(3, 64, downsample=True),
            ImprovedResidualBlock(64, 128, downsample=True),
            ImprovedResidualBlock(128, 256),
            ImprovedResidualBlock(256, 512),
            ImprovedResidualBlock(512, 512, downsample=True),
        )

        self.pool = nn.AdaptiveAvgPool2d(1)
        self.weight_embed = nn.Sequential(
            nn.Linear(1, 32),
            nn.ReLU(),
            nn.Linear(32, 64),
            nn.ReLU(),
        )
        
        self.classifier = nn.Sequential(
            nn.Linear(512 + 64, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes),
        )

    def forward(self, x, weight):
        x = self.features(x)
        x = self.pool(x).view(x.size(0), -1)
        w = self.weight_embed(weight)
        x = torch.cat((x, w), dim=1)
        return self.classifier(x)