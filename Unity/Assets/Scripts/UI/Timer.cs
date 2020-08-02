using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Timer : MonoBehaviour
{
    [SerializeField] Image clockImage;

    public static Timer Instance;

    const float time = 30000;
    float curTime = 0;

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

    public void StartClock()
    {
        StopAllCoroutines();
        StartCoroutine(StartClockRoutine());
    }

    IEnumerator StartClockRoutine()
    {
        curTime = time;
        while (time > 0)
        {
            curTime -= 1;
            UpdateUI();
            yield return new WaitForSeconds(0.001f);
        }
    }

    void UpdateUI()
    {
        clockImage.fillAmount = curTime / time;
    }
}