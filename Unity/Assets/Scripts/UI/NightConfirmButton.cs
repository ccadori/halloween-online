using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class NightConfirmButton : MonoBehaviour
{
    [SerializeField] Button button;

    private void OnEnable()
    {
        button.onClick.AddListener(() => { Confirm(); });
    }

    void Confirm()
    {
        MatchManager.Instance.ConfirmAction();
    }
}