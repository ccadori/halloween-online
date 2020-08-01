using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MatchManager : MonoBehaviour
{
    public string selectedPlayerID;
    public GameCanvas gameCanvas;


    public static MatchManager Instance;

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

    public void ConfirmAction()
    {
        if(selectedPlayerID != "")
        {
            NetworkManager.SendEmitMessage("player-action", JsonUtility.ToJson(new PlayerActionEmit(selectedPlayerID)));
            selectedPlayerID = "";
        }
        else
        {
            NetworkManager.SendEmitMessage("action-skip", "");
        }
        gameCanvas.ConfirmAction();
    }

    public void ConfirmVote()
    {
        if (selectedPlayerID != "")
        {
            Debug.Log("voting");
            NetworkManager.SendEmitMessage("player-vote", JsonUtility.ToJson(new PlayerActionEmit(selectedPlayerID)));
            selectedPlayerID = "";
        }
        else
        {
            Debug.Log("skipping vote");
            NetworkManager.SendEmitMessage("vote-skip", "");
        }
        gameCanvas.ConfirmVote();
    }
}

[System.Serializable]
public class PlayerActionEmit
{
    public string targetId;

    public PlayerActionEmit(string targetId)
    {
        this.targetId = targetId;
    }
}