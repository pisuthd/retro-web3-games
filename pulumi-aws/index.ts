import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";

// Step 1: Create an ECS Fargate cluster.
const cluster = new aws.ecs.Cluster("cluster", {});

// Step 2: Define the Networking for our service.
// Define the Networking for our service.
const alb = new awsx.lb.ApplicationLoadBalancer("net-lb", { listener: { port: 8000 }, defaultTargetGroup: { port: 8000, deregistrationDelay: 0 } });

// Create a repository for container images.
const repo = new awsx.ecr.Repository("repo", {
    forceDelete: true,
});

// Build and publish a Docker image to a private ECR registry.
const img = new awsx.ecr.Image("app-img", { repositoryUrl: repo.url, path: "../packages/app" });

// Create a Fargate service task that can scale out.
const appService = new awsx.ecs.FargateService("app-svc", {
    cluster: cluster.arn,
    assignPublicIp: true,
    taskDefinitionArgs: {
        container: {
            name: "retro",
            image: img.imageUri,
            memory: 2048 /*MB*/,
            portMappings: [
                {
                    targetGroup: alb.defaultTargetGroup,
                }
            ],
            environment: [
                {
                    "name": "PRIVATE_KEY",
                    "value": "0x",
                },
                {
                    "name": "FAUCET_ADDRESS",
                    "value": "0x13E6B05BD8D45aE843674F929A94Edd32BD5e3d9",
                },
                {
                    "name": "RPC_URL",
                    "value": "https://rpc-testnet.saakuru.network",
                },
                {
                    "name": "WEBSOCKET_URL",
                    "value": "wss://ws-testnet.saakuru.network",
                },
                {
                    "name": "MINESWEEPER_ADDRESS",
                    "value": "0xe87A1c7cfE6458CAc665d50CDb85c59E97F3b124",
                },
                {
                    "name": "BLACKJACK_ADDRESS",
                    "value": "0x59A89D64B08CA6832F20bfEE4C1CE18EEebC02F4",
                },
                {
                    "name": "TOMO_ENDPOINT",
                    "value": "https://hackathon.aag.ventures/api/tomoone",
                },
                {
                    "name": "TOMO_API_KEY",
                    "value": "RW3G1-",
                },
                {
                    "name": "TOMO_SITTER_ADDRESS",
                    "value": "0x1Bb6bDf61077cd3f9e61bfCFc3F12f044637dD1a",
                }
            ]
        },
    },
    desiredCount: 1,
});

// Export the Internet address for the service.
export const url = alb.loadBalancer.dnsName