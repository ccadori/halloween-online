using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace Tests
{
    public class PlayerTest
    {
        [UnityTest]
        public IEnumerator SettingPlayerRole()
        {
            var player = new GameObject().AddComponent<Player>();
            player.OnReceiveRole(new RoleData("1"));
            Assert.AreEqual(PlayerRoles.Seer, player.Role);
            yield return null;
        }
    }
}
