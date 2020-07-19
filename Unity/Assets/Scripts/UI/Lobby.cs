using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lobby : MonoBehaviour
{
    [SerializeField] GameObject hostScreen;
    [SerializeField] GameObject clientScreen;

    [SerializeField] Canvas initializationCanvas;
    [SerializeField] Canvas gameCanvas;

    [SerializeField] PlayerListEntryUI playerListEntryPrefab;
    [SerializeField] List<PlayerListEntryUI> playerList = new List<PlayerListEntryUI>();
    [SerializeField] Transform playerListParent;

    private void OnEnable()
    {
        NetworkManager.OnMatchStart += OnRoomStart;
        NetworkManager.OnRoomStartError += OnRoomStartError;
        NetworkManager.OnPlayerConnected += OnPlayerConnected;
        NetworkManager.OnMatchmakingConnected += OnMatchmakingConnected;
    }

    private void OnDisable()
    {
        NetworkManager.OnMatchStart -= OnRoomStart;
        NetworkManager.OnRoomStartError -= OnRoomStartError;
        NetworkManager.OnPlayerConnected -= OnPlayerConnected;
        NetworkManager.OnMatchmakingConnected -= OnMatchmakingConnected;
    }

    void OnRoomStartError()
    {
        Debug.Log("Room Start Error");
    }

    private void OnPlayerConnected(PlayerData playerData)
    {
        populateNightPlayerList();
    }

    void OnMatchmakingConnected(string roomID)
    {
        if (NetworkManager.Instance.isHost)
        {
            hostScreen.SetActive(true);
            clientScreen.SetActive(false);
        }
        else
        {
            clientScreen.SetActive(true);
            hostScreen.SetActive(false);
        }

        populateNightPlayerList();
        Debug.Log("OnEnable");
    }

    private void OnRoomStart()
    {
        initializationCanvas.enabled = false;
        gameCanvas.enabled = true;
    }

    public void StartMatch()
    {
        NetworkManager.SendEmitMessage("room-start", "");
    }

    void populateNightPlayerList()
    {
        clearNightPlayerList();

        PlayerListEntryUI MyPlayerListEntry = Instantiate(playerListEntryPrefab, playerListParent) as PlayerListEntryUI;
        MyPlayerListEntry.gameObject.SetActive(true);
        MyPlayerListEntry.nameText.text = Player.Instance.Name;
        playerList.Add(MyPlayerListEntry);

        foreach (KeyValuePair<string, Player> player in PlayerManager.Instance.playerList)
        {
            PlayerListEntryUI newPlayerListEntry = Instantiate(playerListEntryPrefab, playerListParent) as PlayerListEntryUI;
            newPlayerListEntry.gameObject.SetActive(true);
            newPlayerListEntry.nameText.text = player.Value.Name;
            playerList.Add(newPlayerListEntry);
        }
    }

    void clearNightPlayerList()
    {
        for (int i = 0; i < playerList.Count; i++)
        {
            Destroy(playerList[i].gameObject);
        }

        playerList.Clear();
    }
}