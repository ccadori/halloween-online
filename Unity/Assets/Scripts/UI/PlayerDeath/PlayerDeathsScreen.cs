using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerDeathsScreen : MonoBehaviour
{
    [SerializeField] PlayerDeathEntry playerDeathEntry;
    [SerializeField] Canvas canvas;


    List<PlayerDeathEntry> playerDeathEntryList;

    public static PlayerDeathsScreen Instance;

    private void Awake()
    {
        if(Instance == null)
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
        for(int i = 0; i < deadPlayerData.deadPlayersId.Count; i++)
        {
            RegisterDeath(deadPlayerData.deadPlayersId[i]);
        }
    }


    public void RegisterDeath(string playerId)
    {
        PlayerDeathEntry newEntry = Instantiate(playerDeathEntry, playerDeathEntry.transform.parent);
        newEntry.SetupInformation(playerId);
        newEntry.gameObject.SetActive(true);
        canvas.enabled = true;
        playerDeathEntryList.Add(newEntry);
    }

    public void ClearList()
    {
        for(int i = 0; i < playerDeathEntryList.Count; i++)
        {
            Destroy(playerDeathEntryList[i].gameObject);
        }

        playerDeathEntryList.Clear();
    }
}

[System.Serializable]
public class DeadPlayerData
{
    public List<string> deadPlayersId;
}