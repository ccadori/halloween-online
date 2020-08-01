using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography;
using UnityEngine;
using UnityEngine.UI;

public class GameCanvas : MonoBehaviour
{
    bool isFirstNight = true;

    [SerializeField] CanvasGroup playerListCanvasGroup;

    [Header("Night")]
    [SerializeField] PlayerListEntryUI night_PlayerListEntryPrefab;
    [SerializeField] CanvasGroup night_CanvasGroup;
    [SerializeField] CanvasGroup night_PlayingCanvasGroup;
    [SerializeField] CanvasGroup night_WaitingCanvasGroup;
    [SerializeField] List<PlayerListEntryUI> night_playerList = new List<PlayerListEntryUI>();
    [SerializeField] Transform night_PlayerListParent;
    [SerializeField] GameObject night_DeadScreen;

    [Header("Day")]
    [SerializeField] PlayerListEntryUI day_PlayerListEntryPrefab;
    [SerializeField] CanvasGroup day_CanvasGroup;
    [SerializeField] CanvasGroup day_PlayingCanvasGroup;
    [SerializeField] CanvasGroup day_WaitingCanvasGroup;
    [SerializeField] List<PlayerListEntryUI> day_playerList = new List<PlayerListEntryUI>();
    [SerializeField] Transform day_PlayerListParent;
    [SerializeField] GameObject day_DeadScreen;
    [SerializeField] Button day_confirmButton;
    [SerializeField] Text day_confirmButtonText;



    public static GameCanvas Instance;

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
        NetworkManager.OnNightStarted += OnNightStarted;
        NetworkManager.OnNightEnded += OnNightEnded;
        Player.Instance.OnPlayerDied += OnPlayerDied;
        NetworkManager.OnDeadPlayerList += OnDeadPlayerList;
        NetworkManager.OnVotedPlayerList += OnVotedPlayerList;
    }

    private void OnDisable()
    {
        NetworkManager.OnNightStarted -= OnNightStarted;
        NetworkManager.OnNightEnded -= OnNightEnded;
        Player.Instance.OnPlayerDied -= OnPlayerDied;
        NetworkManager.OnDeadPlayerList -= OnDeadPlayerList;
        NetworkManager.OnVotedPlayerList -= OnVotedPlayerList;
    }

    public void DeselectAllPlayers()
    {
        for(int i = 0; i <  night_playerList.Count; i++)
        {
            night_playerList[i].DeSelect();
        }

        for (int i = 0; i < day_playerList.Count; i++)
        {
            day_playerList[i].DeSelect();
        }
    }

    void populateNightPlayerList()
    {
        clearNightPlayerList();

        foreach(KeyValuePair<string, Player> player in PlayerManager.Instance.playerList)
        {
            if (player.Value.Alive)
            {
                PlayerListEntryUI newPlayerListEntry = Instantiate(night_PlayerListEntryPrefab, night_PlayerListParent) as PlayerListEntryUI;

                if (!Player.Instance.Alive)
                    newPlayerListEntry.selectable = false;

                newPlayerListEntry.nameText.text = player.Value.Name;
                newPlayerListEntry.playerID = player.Key;
                newPlayerListEntry.gameObject.SetActive(true);
                night_playerList.Add(newPlayerListEntry);
            }
        }
    }

    void clearNightPlayerList()
    {
        for(int i = 0; i < night_playerList.Count; i++)
        {
            Destroy(night_playerList[i].gameObject);
        }

        night_playerList.Clear();
    }

    void OnNightStarted()
    {
        Debug.Log("On Night Started");
        if(isFirstNight)
        {
            isFirstNight = false;
            populateNightPlayerList();
        }
        day_PlayingCanvasGroup.alpha = 0;
        night_CanvasGroup.alpha = 1;
        day_CanvasGroup.alpha = 0;
        night_PlayingCanvasGroup.alpha = 1;
        night_WaitingCanvasGroup.alpha = 0;

        if (!Player.Instance.Alive)
            night_DeadScreen.SetActive(true);
    }

    public void ConfirmAction()
    {
        night_PlayingCanvasGroup.alpha = 0;
        night_WaitingCanvasGroup.alpha = 1;
    }

    void populateDayPlayerList()
    {
        clearDayPlayerList();

        foreach (KeyValuePair<string, Player> player in PlayerManager.Instance.playerList)
        {
            if(player.Value.Alive)
            {
                PlayerListEntryUI newPlayerListEntry = Instantiate(day_PlayerListEntryPrefab, day_PlayerListParent) as PlayerListEntryUI;

                if (!Player.Instance.Alive)
                {
                    newPlayerListEntry.selectable = false;
                    day_confirmButton.interactable = false;
                    day_confirmButtonText.text = "You are Dead";
                }

                newPlayerListEntry.nameText.text = player.Value.Name;
                newPlayerListEntry.playerID = player.Key;
                newPlayerListEntry.gameObject.SetActive(true);
                day_playerList.Add(newPlayerListEntry);
            }
        }
    }

    void clearDayPlayerList()
    {
        for (int i = 0; i < day_playerList.Count; i++)
        {
            Destroy(day_playerList[i].gameObject);
        }

        day_playerList.Clear();
    }

    void OnNightEnded()
    {
        Debug.Log("On Night Ended");
        if (isFirstNight)
        {
            isFirstNight = false;
            populateDayPlayerList();
        }
        night_CanvasGroup.alpha = 0;
        day_CanvasGroup.alpha = 1;
        day_PlayingCanvasGroup.alpha = 1;
        day_WaitingCanvasGroup.alpha = 0;

        if(!Player.Instance.Alive)
            day_DeadScreen.SetActive(true);
    }

    public void ConfirmVote()
    {
        day_PlayingCanvasGroup.alpha = 0;
        day_WaitingCanvasGroup.alpha = 1;
    }

    private void OnPlayerDied()
    {
        if (!Player.Instance.Alive)
            day_DeadScreen.SetActive(true);
    }


    private void OnVotedPlayerList(VotedPlayerData data)
    {
        Invoke("populateNightPlayerList",0);
    }

    private void OnDeadPlayerList(DeadPlayerData data)
    {
        Invoke("populateDayPlayerList",0);
    }
}