using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class WerewolfHowlingSound : MonoBehaviour
{

    [SerializeField] AudioSource audioSource;

    private void OnEnable()
    {
        NetworkManager.OnNightStarted += OnNightStarted;
    }

    private void OnDisable()
    {
        NetworkManager.OnNightStarted -= OnNightStarted;
    }

    void OnNightStarted()
    {
        audioSource.Play();
    }
}