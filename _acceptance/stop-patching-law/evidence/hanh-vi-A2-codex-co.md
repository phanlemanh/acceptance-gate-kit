HÀNH ĐỘNG: Dừng lại — KHÔNG tự dispatch vòng sửa thứ ba. Vòng 2 vẫn sinh lỗi cùng ERROR-CLASS với vòng 1 (`string-presence-instead-of-relation` — đo chuỗi-có-mặt thay vì quan hệ, còn nguyên ở E6/E9/E10/E11), nên hình dạng lời giải sai, không phải chi tiết. Tôi trình cho người ba lựa chọn và chờ người chọn: **đổi hình dạng lời giải** · **thu hẹp phạm vi** · **ship kèm known limits**.

CĂN CỨ (nguyên văn, file 2, mục S4 - Verify):

> **Before dispatching the next round, compare this round's error class with the
> previous round's.** If the SECOND fix round still produces errors of the SAME
> CLASS as round one, the **solution shape is wrong**, not the details. STOP — do
> NOT dispatch round three on your own. Present three options to the human:
> **change the shape** · **narrow the scope** · **ship with known limits**;
> patching further is a path the human must choose explicitly, never the default.
> "Same class" means the same ERROR-CLASS NAME from the error-class ledger
> (string-presence-instead-of-relation, lowering-the-ruler, fail-open,
> count-then-discard, tautology, lone-negative-assertion...), NOT the same line of
> code or the same measurement — two errors in different files are still the same
> class if they share a name, and two errors on one line are different classes if
> their names differ.
