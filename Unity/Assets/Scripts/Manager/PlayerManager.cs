using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerManager : MonoBehaviour
{

    public Dictionary<string, Player> PlayerList = new Dictionary<string, Player>();

    [SerializeField] GameObject NetworkPlayerPrefab;

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

    }

    private void OnDisable()
    {
        NetworkManager.OnPlayerConnected -= OnPlayerConnected;
        NetworkManager.OnPlayerDisconnected -= OnPlayerDisconnected;

    }

    private void OnPlayerConnected(PlayerData data)
    {
        Player newPlayer = Instantiate(NetworkPlayerPrefab).GetComponent<Player>();
        PlayerList.Add(data.id, newPlayer);
        newPlayer.Name = data.name;
        newPlayer.ID = data.id;
        Debug.Log("Spawnando Player");
    }

    private void OnPlayerDisconnected(PlayerData data)
    {
        Destroy(PlayerList[data.id].gameObject);
        PlayerList.Remove(data.id);
        Debug.Log("Destruind Player");
    }
}