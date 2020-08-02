using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Timer : MonoBehaviour
{
    [SerializeField] Image clockImage;

    public static Timer Instance;

    const float time = 30;
    float startTime = 0;

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

    private void OnEnable()
    {
        NetworkManager.OnNightStarted += StartClock;
        NetworkManager.OnNightEnded += StartClock;
    }

    private void OnDisable()
    {
        NetworkManager.OnNightStarted -= StartClock;
        NetworkManager.OnNightEnded -= StartClock;
    }

    private void Update()
    {
        UpdateUI(startTime);
    }

    public void StartClock()
    {
        startTime = Time.time;
    }

    void UpdateUI(float startTime)
    {
        float dif = Time.time - startTime;
        clockImage.fillAmount = 1 - (dif / time);
    }
}