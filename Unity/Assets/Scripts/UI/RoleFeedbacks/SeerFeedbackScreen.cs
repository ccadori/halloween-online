using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class SeerFeedbackScreen : MonoBehaviour
{
    [SerializeField] Canvas canvas;
    [SerializeField] TextMeshProUGUI descriptionText;
    [SerializeField] Image roleIconImage;

    private void OnEnable()
    {
        NetworkManager.OnSeerResult += OnSeerResult;
    }

    private void OnDisable()
    {
        NetworkManager.OnSeerResult -= OnSeerResult;
    }

    private void OnSeerResult(SeerResultData seerResultData)
    {
        roleIconImage.sprite = Resources.Load<Sprite>("Portraits/" + seerResultData.roleId);
        descriptionText.text = ""; //TODO: Criar um texto correto
        canvas.enabled = true;
    }
}