using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class MatchMakingErrorScreen : MonoBehaviour
{
    [SerializeField] Canvas canvas;
    [SerializeField] TextMeshProUGUI text;

    private void OnEnable()
    {
        NetworkManager.OnMatchmakingError += onMatchmakingError;
    }

    private void OnDisable()
    {
        NetworkManager.OnMatchmakingError -= onMatchmakingError;
    }

    private void onMatchmakingError(string error)
    {
        canvas.enabled = true;
        text.text = error;
    }
}
