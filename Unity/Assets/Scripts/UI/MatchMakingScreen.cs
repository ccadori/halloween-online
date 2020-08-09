using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class MatchMakingScreen : MonoBehaviour
{
    [SerializeField] string roomID;
    [SerializeField] Button joinBttn;


    [SerializeField] Canvas matchMakingCanvas;
    [SerializeField] Canvas lobbyCanvas;

    [SerializeField] Canvas loadingCanvas;

    [SerializeField] TMP_InputField roomIDText;

    private void OnEnable()
    {
        NetworkManager.OnMatchmakingConnected += OnMatchmakingConnected;
        NetworkManager.OnMatchmakingError += OnMatchmakingError;

    }

    private void OnDisable()
    {
        NetworkManager.OnMatchmakingConnected -= OnMatchmakingConnected;
        NetworkManager.OnMatchmakingError -= OnMatchmakingError;
    }

    private void OnMatchmakingConnected(string roomID)
    {
        matchMakingCanvas.enabled = false;
        lobbyCanvas.enabled = true;
        loadingCanvas.enabled = false;
        OnRoomIDChange(roomID);
    }

    void OnMatchmakingError(string error)
    {
        loadingCanvas.enabled = false;
    }

    public void OnRoomIDChange(string newID)
    {
        roomID = newID;
        roomIDText.text = roomID;
        if (newID.Length > 0)
        {
            joinBttn.interactable = true;
        }
        else
        {
            joinBttn.interactable = false;
        }
    }
    
    public void JoinRoom()
    {
        NetworkManager.SendEmitMessage("matchmaking-join", JsonUtility.ToJson(new JoinRoomEmit(Player.Instance.Name, roomID)));
        NetworkManager.Instance.isHost = false;
        loadingCanvas.enabled = true;
    }

    public void HostRoom()
    {
        NetworkManager.SendEmitMessage("matchmaking-create", JsonUtility.ToJson(new HostRoomEmit(Player.Instance.Name)));
        NetworkManager.Instance.isHost = true;
        loadingCanvas.enabled = true;
    }
}


[System.Serializable]
public class JoinRoomEmit
{
    public string name;
    public string roomId;

    public JoinRoomEmit(string name, string roomID)
    {
        this.name = name;
        roomId = roomID;
    }
}

[System.Serializable]
public class HostRoomEmit
{
    public string name;

    public HostRoomEmit(string name)
    {
        this.name = name;
    }
}
