using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameCanvas : MonoBehaviour
{
    [SerializeField] CanvasGroup playerListCanvasGroup;

    [SerializeField] CanvasGroup playingCanvasGroup;
    [SerializeField] CanvasGroup waitingCanvasGroup;

    private void OnEnable()
    {
        NetworkManager.OnNight += onNight;
    }

    private void OnDisable()
    {
        NetworkManager.OnNight -= onNight;
    }

    void onNight()
    {
        playingCanvasGroup.alpha = 1;
        waitingCanvasGroup.alpha = 0;
    }

    public void ConfirmAction(string playerID)
    {
        playingCanvasGroup.alpha = 0;
        waitingCanvasGroup.alpha = 1;
    }
}