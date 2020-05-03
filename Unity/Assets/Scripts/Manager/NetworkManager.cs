using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using BestHTTP;
using BestHTTP.SocketIO;
using System;
using UnityEngine.SceneManagement;

public class NetworkManager : MonoBehaviour
{

    SocketManager manager;

    #region Actions
    public static Action<PlayerData> OnPlayerConnected;
    public static Action<PlayerData> OnPlayerDisconnected;
    public static Action OnPlayerNameAccepted;
    #endregion


    public static NetworkManager Instance;

    private void Awake()
    {
        if(Instance == null)
        {
            Instance = this;
            Connect();
        }
        else if(Instance != this)
        {
            Destroy(gameObject);
        }
    }



    public void Connect()
    {
        SocketOptions options = new SocketOptions();
        options.AutoConnect = false;

        manager = new SocketManager(new Uri("http://localhost:3000/socket.io/"), options);
        manager.Socket.On(SocketIOEventTypes.Connect, OnServerConnect);
        manager.Socket.On(SocketIOEventTypes.Disconnect, OnServerDisconnect);
        manager.Socket.On(SocketIOEventTypes.Error, OnError);
        manager.Socket.On("player-connected", (Socket socket, Packet packet, object[] args) => 
        {
            PlayerData data = JsonUtility.FromJson<PlayerData>(args[0].ToString());
            Debug.Log("Player connected with ID " + data.id);
            OnPlayerConnected?.Invoke(data); 
        });
        manager.Socket.On("player-disconnected", (Socket socket, Packet packet, object[] args) => {
            PlayerData data = new PlayerData(args[0].ToString(), "");
            Debug.Log("Player Disconnected with ID " + data.id);
            OnPlayerDisconnected?.Invoke(data);
        });
        manager.Socket.On("player-name-accepted", (Socket socket, Packet packet, object[] args) => { OnPlayerNameAccepted?.Invoke(); });
        manager.Socket.On("player-name-rejected", (Socket socket, Packet packet, object[] args) =>
        {
            manager.Close();
            SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        });

        manager.Open();
    }

    void OnServerConnect(Socket socket, Packet packet, params object[] args)
    {
        Debug.Log("Connected");
    }

    void OnServerDisconnect(Socket socket, Packet packet, params object[] args)
    {
        Debug.Log("Disconnected");
    }

    void OnError(Socket socket, Packet packet, params object[] args)
    {
        Error error = args[0] as Error;

        switch (error.Code)
        {
            case SocketIOErrors.User:
                Debug.LogWarning("Exception in an event handler!");
                break;
            case SocketIOErrors.Internal:
                Debug.LogWarning("Internal error!");
                break;
            default:
                Debug.LogWarning("server error!");
                break;
        }
    }
    public static void SendEmitMessage(string message, string json)
    {
        if (Instance.manager != null)
            Instance.manager.Socket.Emit(message, json);
    }
}

[System.Serializable]
public class PlayerData
{
    public string id;
    public string name;

    public PlayerData(string id, string name)
    {
        this.id = id;
        this.name = name;
    }
}