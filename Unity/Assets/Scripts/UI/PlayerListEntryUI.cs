using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerListEntryUI : MonoBehaviour
{
    public Text nameText;
    public string playerID;
    public Button button;
    public GameObject selectionHighlight;

    public bool selectable = true;

    private void OnEnable()
    {
        button.onClick.AddListener(()=> { selectPlayer(); });
        //Invoke("CheckIfPlayerIsAlive", 0f);
    }

    void CheckIfPlayerIsAlive()
    {
        if (!PlayerManager.Instance.playerList[playerID].Alive)
        {
            gameObject.SetActive(false);
        }
    }

    public void selectPlayer ()
    {
        if (!selectable)
            return;

        if (!Player.Instance.Alive)
            return;

        GameCanvas.Instance.DeselectAllPlayers();

        MatchManager.Instance.selectedPlayerID = playerID;
        selectionHighlight.SetActive(true);
    }

    public void DeSelect()
    {
        selectionHighlight.SetActive(false);
    }
}