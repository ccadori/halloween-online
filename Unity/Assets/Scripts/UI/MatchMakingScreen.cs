using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MatchMakingScreen : MonoBehaviour
{
    [SerializeField] string roomID;
    [SerializeField] Button joinBttn;


    [SerializeField] Canvas gameCanvas;
    [SerializeField] Canvas InitializationCanvas;

    private void OnEnable()
    {
        NetworkManager.OnMatchmakingConnected += OnMatchmakingConnected;
    }

    private void OnDisable()
    {
        NetworkManager.OnMatchmakingConnected -= OnMatchmakingConnected;
    }

    private void OnMatchmakingConnected(string roomID)
    {
        InitializationCanvas.enabled = false;
        gameCanvas.enabled = true;
    }

    public void OnRoomIDChange(string newID)
    {
        roomID = newID;
        if(newID.Length > 0)
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
    }

    public void HostRoom()
    {
        NetworkManager.SendEmitMessage("matchmaking-create", JsonUtility.ToJson(new HostRoomEmit(Player.Instance.Name)));
    }
}


[System.Serializable]
public class JoinRoomEmit
{
    public string Name;
    public string RoomID;

    public JoinRoomEmit(string name, string roomID)
    {
        Name = name;
        RoomID = RoomID;
    }
}

[System.Serializable]
public class HostRoomEmit
{
    public string Name;

    public HostRoomEmit(string name)
    {
        Name = name;
    }
}
