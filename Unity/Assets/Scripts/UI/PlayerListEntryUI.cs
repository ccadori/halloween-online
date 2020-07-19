using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerListEntryUI : MonoBehaviour
{
    public Text NameText;
    public string playerID;
    public Button Button;
    public GameObject selectionHighlight;

    private void OnEnable()
    {
        Button.onClick.AddListener(()=> { selectPlayer(); });
    }

    public void selectPlayer ()
    {
        GameCanvas.Instance.DeselectAllPlayers();

        MatchManager.Instance.selectedPlayerID = playerID;
        selectionHighlight.SetActive(true);
    }

    public void DeSelect()
    {
        selectionHighlight.SetActive(false);
    }
}