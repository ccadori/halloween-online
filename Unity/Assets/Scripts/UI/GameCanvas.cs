using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameCanvas : MonoBehaviour
{
    [SerializeField] CanvasGroup playerListCanvasGroup;
    [SerializeField] PlayerListEntryUI playerListEntryPrefab;
    [SerializeField] List<PlayerListEntryUI> night_playerList = new List<PlayerListEntryUI>();
    [SerializeField] Transform night_PlayerListParent;
    [SerializeField] List<PlayerListEntryUI> day_playerList = new List<PlayerListEntryUI>();
    [SerializeField] Transform day_PlayerListParent;

    [Header("Night")]
    [SerializeField] CanvasGroup night_CanvasGroup;
    [SerializeField] CanvasGroup night_PlayingCanvasGroup;
    [SerializeField] CanvasGroup night_WaitingCanvasGroup;

    [Header("Day")]
    [SerializeField] CanvasGroup dayCanvasGroup;
    [SerializeField] CanvasGroup day_PlayingCanvasGroup;
    [SerializeField] CanvasGroup day_WaitingCanvasGroup;

    private void OnEnable()
    {
        NetworkManager.OnNight += onNight;
        NetworkManager.OnDay += onDay;
    }

    private void OnDisable()
    {
        NetworkManager.OnNight -= onNight;
        NetworkManager.OnDay -= onDay;
    }

    void populateNightPlayerList()
    {
        clearNightPlayerList();

        foreach(KeyValuePair<string, Player> player in PlayerManager.Instance.PlayerList)
        {
            PlayerListEntryUI newPlayerListEntry = Instantiate(playerListEntryPrefab, night_PlayerListParent) as PlayerListEntryUI;
            newPlayerListEntry.NameText.text = player.Value.Name;
            newPlayerListEntry.Button.onClick.AddListener(() => ConfirmAction(player.Value.ID));
            night_playerList.Add(newPlayerListEntry);
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

    void onNight()
    {
        populateNightPlayerList();
        day_PlayingCanvasGroup.alpha = 0;
        night_CanvasGroup.alpha = 1;
        night_PlayingCanvasGroup.alpha = 1;
        night_WaitingCanvasGroup.alpha = 0;
    }

    public void ConfirmAction(string playerID)
    {
        night_PlayingCanvasGroup.alpha = 0;
        night_WaitingCanvasGroup.alpha = 1;
    }

    void populateDayPlayerList()
    {
        clearDayPlayerList();

        foreach (KeyValuePair<string, Player> player in PlayerManager.Instance.PlayerList)
        {
            PlayerListEntryUI newPlayerListEntry = Instantiate(playerListEntryPrefab, day_PlayerListParent) as PlayerListEntryUI;
            newPlayerListEntry.NameText.text = player.Value.Name;
            newPlayerListEntry.Button.onClick.AddListener(() => confirmVote(player.Value.ID));
            day_playerList.Add(newPlayerListEntry);
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

    void onDay()
    {
        populateDayPlayerList();
        night_CanvasGroup.alpha = 0;
        day_PlayingCanvasGroup.alpha = 1;
        day_PlayingCanvasGroup.alpha = 1;
        day_WaitingCanvasGroup.alpha = 0;
    }

    public void confirmVote(string playerID)
    {
        day_PlayingCanvasGroup.alpha = 0;
        day_WaitingCanvasGroup.alpha = 1;
    }
}