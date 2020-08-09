using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class PlayerListEntryUI : MonoBehaviour
{
    public TextMeshProUGUI nameText;
    public string playerID;
    public Button button;
    public GameObject selectionHighlight;
    public GameObject wolfPaw;

    public bool selectable = true;

    public bool selected = false;

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

        if(!selected)
        {
            GameCanvas.Instance.DeselectAllPlayers();

            MatchManager.Instance.selectedPlayerID = playerID;
            selectionHighlight.SetActive(true);
            selected = true;
        }
        else
        {
            GameCanvas.Instance.DeselectAllPlayers();
            MatchManager.Instance.selectedPlayerID = "";
            selected = false;
            selectionHighlight.SetActive(false);
        }
    }

    public void DeSelect()
    {
        selected = false;
        selectionHighlight.SetActive(false);
    }
}