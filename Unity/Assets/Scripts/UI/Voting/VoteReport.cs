using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VoteReport : MonoBehaviour
{
    [SerializeField] PlayerVotedEntry playerVotedEntry;
    [SerializeField] Canvas canvas;

    List<PlayerVotedEntry> playerVoteEntryList = new List<PlayerVotedEntry>();

    public static VoteReport Instance;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else if (Instance != this)
        {
            Destroy(gameObject);
        }
    }

    private void OnEnable()
    {
        NetworkManager.OnDeadPlayerList += OnDeadPlayerList;
    }

    private void OnDisable()
    {
        NetworkManager.OnDeadPlayerList -= OnDeadPlayerList;
    }

    public void OnDeadPlayerList(DeadPlayerData deadPlayerData)
    {
        for (int i = 0; i < deadPlayerData.deadPlayersId.Count; i++)
        {
            RegisterDeath(deadPlayerData.deadPlayersId[i]);
        }
    }


    public void RegisterDeath(string playerId)
    {
        if (playerId != Player.Instance.ID)
        {
            PlayerVotedEntry newEntry = Instantiate(playerVotedEntry, playerVotedEntry.transform.parent);
            newEntry.SetupInformation(playerId);
            newEntry.gameObject.SetActive(true);
            canvas.enabled = true;
            playerVoteEntryList.Add(playerVotedEntry);
        }
        else
        {
            PlayerVotedEntry newEntry = Instantiate(playerVotedEntry, playerVotedEntry.transform.parent);
            newEntry.SetupInformation(Player.Instance);
            newEntry.gameObject.SetActive(true);
            canvas.enabled = true;
            playerVoteEntryList.Add(newEntry);
        }
    }

    public void ClearList()
    {
        for (int i = 0; i < playerVoteEntryList.Count; i++)
        {
            Destroy(playerVoteEntryList[i].gameObject);
        }

        playerVoteEntryList.Clear();
    }
}

[System.Serializable]
public class VotedPlayerData
{
    public List<string> votedPlayersId;
}