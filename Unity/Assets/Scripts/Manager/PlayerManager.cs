using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerManager : MonoBehaviour
{

    public Dictionary<string, Player> playerList = new Dictionary<string, Player>();

    [SerializeField] GameObject networkPlayerPrefab;

    public string roomID;

    public static PlayerManager Instance;

    private void Awake()
    {
        if(Instance == null)
        {
            Instance = this;
        }
        else if(Instance != this)
        {
            Destroy(gameObject);
        }
    }


    private void OnEnable()
    {
        NetworkManager.OnPlayerConnected += OnPlayerConnected;
        NetworkManager.OnPlayerDisconnected += OnPlayerDisconnected;
        NetworkManager.OnMatchmakingConnected += OnMatchmakingConnected;

    }

    private void OnDisable()
    {
        NetworkManager.OnPlayerConnected -= OnPlayerConnected;
        NetworkManager.OnPlayerDisconnected -= OnPlayerDisconnected;
        NetworkManager.OnMatchmakingConnected -= OnMatchmakingConnected;

    }

    private void OnMatchmakingConnected(string roomID)
    {
        this.roomID = roomID;
    }

    private void OnPlayerConnected(PlayerData data)
    {
        Player newPlayer = Instantiate(networkPlayerPrefab).GetComponent<Player>();
        playerList.Add(data.id, newPlayer);
        newPlayer.Name = data.name;
        newPlayer.ID = data.id;
        Debug.Log("Spawnando Player");
    }

    private void OnPlayerDisconnected(PlayerData data)
    {
        Destroy(playerList[data.id].gameObject);
        playerList.Remove(data.id);
        Debug.Log("Destruind Player");
    }
}