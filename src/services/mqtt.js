import mqtt from "mqtt";

class MQTTService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = new Map();
  }

  connect() {
    if (this.client) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const protocol = "ws"; // WebSocket (non-secure for broker.mqtt-dashboard.com)
        const host =
          import.meta.env.VITE_MQTT_HOST || "broker.mqtt-dashboard.com";
        const port = import.meta.env.VITE_MQTT_WS_PORT || 8000;
        const username = import.meta.env.VITE_MQTT_USER;
        const password = import.meta.env.VITE_MQTT_PASSWORD;

        const url = `${protocol}://${host}:${port}/mqtt`;

        const options = {
          clientId: `web_client_${Math.random().toString(16).substr(2, 8)}`,
          username,
          password,
          clean: true,
          reconnectPeriod: 5000,
        };

        console.log("Connecting to MQTT broker:", url);

        this.client = mqtt.connect(url, options);

        this.client.on("connect", () => {
          console.log("✅ MQTT connected successfully");
          this.connected = true;
          resolve();
        });

        this.client.on("error", (error) => {
          console.error("❌ MQTT error:", error);
          this.connected = false;
          reject(error);
        });

        this.client.on("close", () => {
          console.log("MQTT connection closed");
          this.connected = false;
        });

        this.client.on("message", (topic, message) => {
          this.handleMessage(topic, message);
        });
      } catch (error) {
        console.error("Failed to connect to MQTT:", error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.connected = false;
      this.subscribers.clear();
    }
  }

  subscribe(topic, callback) {
    if (!this.client) {
      console.error("MQTT client not connected");
      return;
    }

    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
      this.client.subscribe(topic, (error) => {
        if (error) {
          console.error(`Failed to subscribe to ${topic}:`, error);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    }

    this.subscribers.get(topic).add(callback);
  }

  unsubscribe(topic, callback) {
    if (!this.client) {
      return;
    }

    const callbacks = this.subscribers.get(topic);
    if (callbacks) {
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.client.unsubscribe(topic);
        this.subscribers.delete(topic);
        console.log(`Unsubscribed from ${topic}`);
      }
    }
  }

  publish(topic, message, options = {}) {
    if (!this.client || !this.connected) {
      console.error("MQTT client not connected");
      return Promise.reject(new Error("Not connected"));
    }

    return new Promise((resolve, reject) => {
      const payload =
        typeof message === "string" ? message : JSON.stringify(message);

      this.client.publish(topic, payload, options, (error) => {
        if (error) {
          console.error(`Failed to publish to ${topic}:`, error);
          reject(error);
        } else {
          console.log(`Published to ${topic}`);
          resolve();
        }
      });
    });
  }

  handleMessage(topic, message) {
    const callbacks = this.subscribers.get(topic);

    if (callbacks) {
      try {
        const payload = JSON.parse(message.toString());
        callbacks.forEach((callback) => callback(payload, topic));
      } catch (error) {
        // If not JSON, pass as string
        const payload = message.toString();
        callbacks.forEach((callback) => callback(payload, topic));
      }
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
export default new MQTTService();
