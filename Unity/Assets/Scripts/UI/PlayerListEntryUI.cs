using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerListEntryUI : MonoBehaviour
{
    public Text NameText;
    public string playerID;
    public Button Button;

    private void OnEnable()
    {
        Button.onClick.AddListener(()=> { selectPlayer(); });
    }

    public void selectPlayer ()
    {
        MatchManager.Instance.selectedPlayerID = playerID;
    }
}