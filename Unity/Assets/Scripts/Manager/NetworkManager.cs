﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using BestHTTP;
using BestHTTP.SocketIO;
using System;
using UnityEngine.SceneManagement;

public class NetworkManager : MonoBehaviour
{

    SocketManager manager;

    public bool isHost;

    public string url_development = "http://localhost:3000/socket.io/";
    public string url_release = "http://64.227.107.160:3000";

    #region Actions
    public static Action<PlayerData> OnPlayerConnected;
    public static Action<PlayerData> OnPlayerDisconnected;
    public static Action<string> OnMatchmakingConnected;
    public static Action<string> OnMatchmakingError;
    public static Action OnMatchStart;
    public static Action<MatchEndData> OnMatchEnd;
    public static Action OnRoomStartError;
    public static Action<RoleData> OnReceiveRole;

    public static Action OnNightStarted;
    public static Action OnNightEnded;

    public static Action<DeadPlayerData> OnDeadPlayerList;
    public static Action<VotedPlayerData> OnVotedPlayerList;

    public static Action<SeerResultData> OnSeerResult;
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

#if UNITY_EDITOR
        manager = new SocketManager(new Uri(url_development), options);
#else
        manager = new SocketManager(new Uri(url_release), options);
#endif
        manager.Socket.On(SocketIOEventTypes.Connect, OnServerConnect);
        manager.Socket.On(SocketIOEventTypes.Disconnect, OnServerDisconnect);
        manager.Socket.On(SocketIOEventTypes.Error, (Socket socket, Packet packet, object[] args) => {
            OnError(socket, packet, args);
            OnMatchmakingError?.Invoke("Network Error");
            manager.Close();
        });
        manager.Socket.On("player-connected", (Socket socket, Packet packet, object[] args) =>
        {
            Debug.Log(args[0].ToString());
            PlayerData data = JsonUtility.FromJson<PlayerData>(args[0].ToString());
            Debug.Log("Player connected with ID " + data.id);
            OnPlayerConnected?.Invoke(data);
        });
        manager.Socket.On("player-disconnected", (Socket socket, Packet packet, object[] args) => {
            PlayerData data = new PlayerData(args[0].ToString(), "");
            Debug.Log("Player Disconnected with ID " + data.id);
            OnPlayerDisconnected?.Invoke(data);
        });
        manager.Socket.On("player-name-rejected", (Socket socket, Packet packet, object[] args) =>
        {
            manager.Close();
            SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        });
        //MatchMaking
        manager.Socket.On("matchmaking-connected", (Socket socket, Packet packet, object[] args) => { OnMatchmakingConnected?.Invoke(args[0].ToString()); });
        manager.Socket.On("matchmaking-error", (Socket socket, Packet packet, object[] args) => { OnMatchmakingError?.Invoke(args[0].ToString()); });
        manager.Socket.On("match-started", (Socket socket, Packet packet, object[] args) => { OnMatchStart?.Invoke(); });
        manager.Socket.On("room-start-error", (Socket socket, Packet packte, object[] args) => { OnRoomStartError?.Invoke(); });
        manager.Socket.On("night-started", (Socket socket, Packet packet, object[] args) => { OnNightStarted?.Invoke(); });
        manager.Socket.On("night-ended", (Socket socket, Packet packet, object[] args) => { OnNightEnded?.Invoke(); });
        //Roles
        manager.Socket.On("role-set", (Socket socket, Packet packet, object[] args) => { OnReceiveRole?.Invoke(JsonUtility.FromJson<RoleData>(args[0].ToString())); });
        //Events
        manager.Socket.On("night-report", (Socket socket, Packet packet, object[] args) => { OnDeadPlayerList?.Invoke(JsonUtility.FromJson<DeadPlayerData>(args[0].ToString())); });
        manager.Socket.On("vote-report", (Socket socket, Packet packet, object[] args) => { OnVotedPlayerList?.Invoke(JsonUtility.FromJson<VotedPlayerData>(args[0].ToString())); });
        manager.Socket.On("match-end", (Socket socket, Packet packet, object[] args) => { OnMatchEnd?.Invoke(JsonUtility.FromJson<MatchEndData>(args[0].ToString())); });

        //Class Specific
        manager.Socket.On("action-result-seer", (Socket socket, Packet packet, object[] args) => { OnSeerResult?.Invoke(JsonUtility.FromJson<SeerResultData>(args[0].ToString())); });


        manager.Open();
    }

    void OnServerConnect(Socket socket, Packet packet, params object[] args)
    {
        Player.Instance.ID = socket.Id;
        Debug.Log("Connected");
    }

    void OnServerDisconnect(Socket socket, Packet packet, params object[] args)
    {
        isHost = false;
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

    public void CloseConnection()
    {
        manager.Close();
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
}

[Serializable]
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


[Serializable]
public class RoleData
{
    public string id;
    public RoleData(string id)
    {
        this.id = id;
    }
}

[Serializable]
public class SeerResultData
{
    public int roleId;
}

[Serializable]
public class MatchEndData
{
    public bool isTownWinner;
}